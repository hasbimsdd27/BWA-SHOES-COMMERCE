package categoryRepositories

import (
	"encoding/json"
	"server/libs"
	"server/models"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type PayloadBulkDelete struct {
	Ids []int `json:"ids"`
}

func BulkDeleteCategory(c *fiber.Ctx) error {
	var payloadBulkDelete PayloadBulkDelete
	db := libs.DB

	if err := c.BodyParser(&payloadBulkDelete); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "check your input data",
		})
	}

	s, _ := json.Marshal(payloadBulkDelete.Ids)

	if err := db.Where("id in (" + strings.Trim(string(s), "[]") + ")").Delete(&models.ProductCategories{}).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(404).JSON(fiber.Map{
				"status":  "error",
				"message": "product not found",
			})
		} else {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}

	// db.Delete(&category)

	return c.Status(204).JSON(fiber.Map{
		"status": "success",
	})
}
