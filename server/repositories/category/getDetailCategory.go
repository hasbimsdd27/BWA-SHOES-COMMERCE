package categoryRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func GetDetailCategory(c *fiber.Ctx) error {
	var category models.ProductCategories

	db := libs.DB
	id := c.Params("id")

	if err := db.Where("id = ?", id).First(&category).Error; err != nil {
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

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   category,
	})
}
