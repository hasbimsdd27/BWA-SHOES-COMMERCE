package transactionRepositories

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"server/libs"
	"server/models"
	ongkirRepositories "server/repositories/ongkir"
	"server/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type PayloadTransaction struct {
	ProductIDs  []string `json:"product_ids"`
	CourierName string   `json:"courier_name"`
	ServiceCode string   `json:"service_code"`
}

func CreateTransaction(c *fiber.Ctx) error {
	var payload PayloadTransaction
	var err error
	var products []models.Products
	var modifiedId []string
	var AdminUser models.Users
	var User models.Users
	var responseShipping ongkirRepositories.ResBody
	var CourierData ongkirRepositories.CourirerRes

	objProducts := make(map[string]models.Products)
	totalPrice := 0
	// shippingPrice := 0
	weight := 0

	db := libs.DB

	if err = c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	for _, s := range payload.ProductIDs {
		modifiedId = append(modifiedId, `"`+s+`"`)
	}

	if err = db.Preload("Category").Preload("Galeries").Where(fmt.Sprintf(`id IN (%s)`, strings.Join(modifiedId, ","))).Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	for _, product := range products {
		if product.ID != uuid.Nil {
			totalPrice = totalPrice + int(product.Price)
			weight = weight + int(product.Weight)
			objProducts[product.ID.String()] = product
		}
	}

	if err = db.Preload("UserAddress").Where("role = ?", "ADMIN").First(&AdminUser).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if err = db.Preload("UserAddress").Where("id = ?", c.Locals("user_id")).First(&User).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	baseUrl := utils.GetENV("ONGKIR_HOST")

	var jsonStr = []byte(fmt.Sprintf(`{"origin":%d,"origin_type":"%s","destination":%d,"destination_type":"%s","weight":%d,"courier":["jne","pos","sicepat","jnt", "wahana", "tiki"]}`, AdminUser.UserAddress.AddressID,
		AdminUser.UserAddress.AddressType, User.UserAddress.AddressID, User.UserAddress.AddressType, weight))

	req, err := http.NewRequest("POST", baseUrl+"/cost", bytes.NewBuffer(jsonStr))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {

		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	defer res.Body.Close()

	if err = json.NewDecoder(res.Body).Decode(&responseShipping); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})

	}

	for _, courier := range responseShipping.Data.Courier {
		if courier.Code == payload.ServiceCode && courier.Name == payload.CourierName {
			CourierData = courier
		}
	}

	return c.Status(200).JSON(fiber.Map{
		"status":   "success",
		"data":     objProducts,
		"shipping": CourierData,
	})
}
