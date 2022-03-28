package repositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

type PayloadCategory struct {
	Name string `json:"name"`
}

func CreateCategory(c *fiber.Ctx) error {
	var payloadCategory PayloadCategory

	db := libs.DB

	category := new(models.ProductCategories)

	err := c.BodyParser(&payloadCategory)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "check your input data",
		})
	}

	if len(payloadCategory.Name) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "name can't be empty",
		})
	}

	category.Name = payloadCategory.Name

	err = db.Create(&category).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   category,
	})

}
