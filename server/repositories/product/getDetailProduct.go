package productRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func DetailProduct(c *fiber.Ctx) error {
	var product models.Products
	var productOrigin models.UserAddress
	responseDetailProduct := map[string]interface{}{}

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

	if err := db.Where("user_id = ?", product.CreatedBy).First(&productOrigin).Error; err != nil {
		if err.Error() != "record not found" {

			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}

	}

	responseDetailProduct["product"] = product
	responseDetailProduct["origin"] = productOrigin

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   responseDetailProduct,
	})

}
