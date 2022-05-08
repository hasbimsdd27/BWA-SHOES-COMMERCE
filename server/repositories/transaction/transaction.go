package transactionRepositories

import (
	"fmt"
	"server/libs"
	"server/models"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type PayloadTransaction struct {
	ProductIDs []string `json:"product_ids"`
}

func CreateTransaction(c *fiber.Ctx) error {
	var payload PayloadTransaction
	var err error
	var products models.Products
	var modifiedId []string

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

	if err = db.Where(fmt.Sprintf(`id IN (%s)`, strings.Join(modifiedId, ","))).Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
	})
}
