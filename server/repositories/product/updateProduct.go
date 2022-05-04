package productRepositories

import (
	"fmt"
	"server/libs"
	"server/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func UpdateProduct(c *fiber.Ctx) error {
	payload := &Payload{}
	var product models.Products
	var category models.ProductCategories
	var galeries []models.ProductGaleries
	id := c.Params("id")
	db := libs.DB

	if err := c.BodyParser(&payload); err != nil {
		if err.Error() == "Unprocessable Entity" {
			return c.Status(400).JSON(fiber.Map{
				"status":  "error",
				"message": "please submit a valid payload",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

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

	if err := db.Where("id = ?", payload.CategoryId).First(&category).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(404).JSON(fiber.Map{
				"status":  "error",
				"message": "category not found",
			})
		} else {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}

	if category.ID == uuid.Nil {
		return c.Status(404).JSON(fiber.Map{
			"status":  "error",
			"message": "category not found",
		})
	}

	if err := db.Where("product_id = ?", product.ID).Find(&galeries).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	ImageList := map[string]bool{}

	for _, value := range galeries {
		ImageList[value.Url] = false
	}

	for _, value := range payload.Galeries {
		_, ok := ImageList[value]
		if ok {
			delete(ImageList, value)
		} else {
			ImageList[value] = true
		}
	}

	var DeleteImage []string
	var AddImage []string

	for key, val := range ImageList {
		if val {
			AddImage = append(AddImage, key)
		} else {
			DeleteImage = append(DeleteImage, key)
		}
	}

	if len(DeleteImage) > 0 {
		var fieldQuery []string

		for _, value := range DeleteImage {
			fieldQuery = append(fieldQuery, fmt.Sprintf("url = '%s'", value))
		}

		query := fmt.Sprintf("product_id =  %d AND ( %s )", product.ID, strings.Join(fieldQuery[:], " OR "))

		if err := db.Delete(&models.ProductGaleries{}, query).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}

	if len(AddImage) > 0 {
		Galeries := []models.ProductGaleries{}

		for _, value := range AddImage {
			Galeries = append(Galeries, models.ProductGaleries{
				ProductId: product.ID,
				Url:       value,
			})
		}

		if err := db.CreateInBatches(Galeries, len(Galeries)).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}

	}
	if payload.Name != "" {
		product.Name = payload.Name
	}

	if payload.Tags != "" {
		product.Tags = payload.Tags
	}

	if payload.CategoryId != "" {
		product.CategoryId = payload.CategoryId
	}
	if payload.Description != "" {
		product.Description = payload.Description
	}
	if payload.Price != 0 {
		product.Price = payload.Price
	}

	if payload.Weight != 0 {
		product.Weight = payload.Weight
	}

	db.Save(&product)

	db.Preload("Category").Preload("Galeries").Where("id = ?", product.ID).First(&product)

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   product,
	})
}
