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
	CartIds     []string `json:"cart_ids"`
	CourierName string   `json:"courier_name"`
	ServiceCode string   `json:"service_code"`
}

type BodyAPIMidtransGatewayData struct {
	Token       string `json:"token"`
	RedirectUrl string `json:"redirect_url"`
}
type BodyAPIMidtransGateway struct {
	Status string                     `json:"status"`
	Data   BodyAPIMidtransGatewayData `json:"data"`
}

func CreateTransaction(c *fiber.Ctx) error {
	var payload PayloadTransaction
	var err error
	var products []models.Products
	var modifiedId []string
	var productId []string
	var AdminUser models.Users
	var User models.Users
	var responseShipping ongkirRepositories.ResBody
	var CourierData ongkirRepositories.CourirerRes
	var TransactionItems []models.TransactionItems
	var Carts []models.UserCart
	var BodyMidtransGateway BodyAPIMidtransGateway

	objProducts := make(map[string]models.Products)
	totalPrice := 0
	weight := 0

	db := libs.DB

	if err = c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if len(payload.CartIds) == 0 || payload.CourierName == "" || payload.ServiceCode == "" {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "please fill all required fields",
		})
	}

	for _, s := range payload.CartIds {
		modifiedId = append(modifiedId, `"`+s+`"`)
	}

	if err = db.Where(fmt.Sprintf(`id IN (%s)`, strings.Join(modifiedId, ","))).Find(&Carts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if len(Carts) != len(payload.CartIds) {
		return c.Status(404).JSON(fiber.Map{
			"status":  "error",
			"message": "data not found",
		})
	}

	for _, p := range Carts {
		productId = append(productId, `"`+p.ProductID.String()+`"`)
	}

	if err = db.Preload("Category").Preload("Galeries").Where(fmt.Sprintf(`id IN (%s)`, strings.Join(productId, ","))).Find(&products).Error; err != nil {
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

	if CourierData.Name == "" {
		return c.Status(404).JSON(fiber.Map{
			"status":  "error",
			"message": "courier not found",
		})
	}
	Transaction := &models.Transactions{
		ID:              uuid.New(),
		UserId:          User.ID,
		CompleteAddress: User.UserAddress.CompleteAddress,
		AddressID:       User.UserAddress.AddressID,
		AddressName:     User.UserAddress.AddressName,
		AddressType:     User.UserAddress.AddressType,
		ShippingCourier: CourierData.Name,
		ShippingService: CourierData.ServiceName,
		ShippingPrice:   float32(CourierData.Price),
		TotalPrice:      float32(totalPrice),
		Status:          "PENDING",
		Payment:         "MIDTRANS",
	}

	if err = db.Create(&Transaction).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	for _, cartData := range Carts {
		TransactionItems = append(TransactionItems, models.TransactionItems{
			ID:                 uuid.New(),
			TransactionId:      Transaction.ID,
			Quantity:           cartData.Quantity,
			ProductImage:       objProducts[string(cartData.ProductID.String())].Galeries[0].Url,
			ProductPrice:       objProducts[string(cartData.ProductID.String())].Price,
			ProductDescription: objProducts[string(cartData.ProductID.String())].Description,
			ProductCategory:    objProducts[string(cartData.ProductID.String())].Category.Name,
			ProductWeight:      objProducts[string(cartData.ProductID.String())].Weight,
			ProductTags:        objProducts[string(cartData.ProductID.String())].Tags,
		})
	}

	if err = db.Create(&TransactionItems).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	baseUrlMidtrans := utils.GetENV("MIDTRANS_HOST")
	var jsonStrPayment = []byte(fmt.Sprintf(`
	{
		"webhook_url": "%s",
		"payload": {
		  "transaction_details": {
			"order_id": "%s",
			"gross_amount": %d
		  },
		  "credit_card": {
			"secure": true
		  },
		  "customer_details": {
			"first_name": "%s",
			"last_name": "%s",
			"email": "%s",
			"phone": "%s"
		  }
		}
	  }
	`, utils.GetENV("SERVER_HOST")+"/api/webhook", Transaction.ID.String(), totalPrice, strings.Split(User.Name, " ")[0], strings.Split(User.Name, " ")[1], User.Email, User.Phone))

	reqPayment, err := http.NewRequest("POST", baseUrlMidtrans+"/create", bytes.NewBuffer(jsonStrPayment))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	reqPayment.Header.Set("Content-Type", "application/json")

	clientPayment := &http.Client{}
	resPayment, err := clientPayment.Do(reqPayment)
	if err != nil {

		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	defer resPayment.Body.Close()

	if err = json.NewDecoder(resPayment.Body).Decode(&BodyMidtransGateway); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})

	}
	db.Delete(&Carts)

	return c.Status(resPayment.StatusCode).JSON(BodyMidtransGateway)
}
