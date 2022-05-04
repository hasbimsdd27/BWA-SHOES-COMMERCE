package cartRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func DeleteCart(c *fiber.Ctx) error {
	var cart models.UserCart

	db := libs.DB
	id := c.Params("id")

	if err := db.Where("id = ? AND user_id = ?", id, c.Locals("user_id")).First(&cart).Error; err != nil {
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

	db.Delete(&cart)

	return c.Status(204).JSON(fiber.Map{
		"status": "success",
		"data":   cart,
	})
}
