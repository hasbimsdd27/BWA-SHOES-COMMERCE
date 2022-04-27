package productRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func GetCustomProduct(c *fiber.Ctx) error {
	var popularProducts []models.Products
	var newArrival []models.Products
	var err error

	db := libs.DB

	if err = db.Preload("Category").Preload("Galeries").Limit(10).Order("rating desc").Find(&popularProducts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if err = db.Preload("Category").Preload("Galeries").Limit(10).Order("created_at desc").Find(&newArrival).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	payloadResponse := map[string]interface{}{
		"popular_products": popularProducts,
		"new_arrival":      newArrival,
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   payloadResponse,
	})
}
