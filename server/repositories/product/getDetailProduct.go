package productRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func DetailProduct(c *fiber.Ctx) error {
	var product models.Products

	db := libs.DB
	id := c.Params("id")

	if err := db.Preload("Category").Preload("Galeries").Where("id = ?", id).First(&product).Error; err != nil {
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

	if product.ID == uuid.Nil {
		return c.Status(404).JSON(fiber.Map{
			"status":  "error",
			"message": "data not found",
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   product,
	})

}
