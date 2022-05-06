package cartRepositories

import (
	"fmt"
	"log"
	"server/libs"
	"server/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ResponseCart struct {
	ID       uuid.UUID       `json:"id"`
	Product  models.Products `json:"product"`
	Quantity int             `json:"quantity"`
}

func GetCarts(c *fiber.Ctx) error {

	var products []models.Products
	var carts []models.UserCart
	var productIds []string
	var responseData []ResponseCart

	db := libs.DB
	if err := db.Where("user_id = ?", c.Locals("user_id")).Find(&carts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	log.Println(len(carts))

	if len(carts) > 0 {

		for _, item := range carts {
			productIds = append(productIds, `"`+item.ProductID.String()+`"`)
		}

		if err := db.Preload("Category").Preload("Galeries").Where(fmt.Sprintf("id IN (%s)", strings.Join(productIds, ","))).Find(&products).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}

		tempObjProduct := map[string]models.Products{}

		for _, item := range products {
			tempObjProduct[item.ID.String()] = item
		}

		for _, item := range carts {
			responseData = append(responseData, ResponseCart{
				ID:       item.ID,
				Quantity: item.Quantity,
				Product:  tempObjProduct[item.ProductID.String()],
			})
		}
	} else {
		responseData = make([]ResponseCart, 0)

	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   responseData,
	})

}
