package productRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func DeleteProduct(c *fiber.Ctx) error {
	var product models.Products

	id := c.Params("id")
	db := libs.DB

	if err := db.Where("id = ?", id).First(&product).Error; err != nil {
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

	if product.ID == 0 {
		return c.Status(404).JSON(fiber.Map{
			"status":  "error",
			"message": "product not found",
		})
	}
	if err := db.Delete(&product).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"status":  "success",
		"message": "data deleted",
	})

}
