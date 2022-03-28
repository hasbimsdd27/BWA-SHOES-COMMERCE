package productRepositories

import (
	"math"
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

type QueryData struct {
	Id          int    `query:"id"`
	Limit       int    `query:"limit"`
	Name        string `query:"name"`
	Description string `query:"description"`
	PriceForm   int    `query:"price_form"`
	PriceTo     int    `query:"price_to"`
	Tags        string `query:"tags"`
	Category    int    `query:"category"`
	Page        int    `query:"page"`
}

type ResponseData struct {
	Data        []models.Products `json:"data"`
	TotalPage   float64           `json:"total_pages"`
	CurrentPage int               `json:"current_page"`
	Limit       int               `json:"limit"`
	TotalData   int               `json:"total_data"`
}

func AllProducts(c *fiber.Ctx) error {
	var products []models.Products
	var count int64
	var limit int
	var response ResponseData

	query := new(QueryData)

	if err := c.QueryParser(query); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	db := libs.DB

	if query.Limit < 5 {
		limit = 5
	} else {
		limit = query.Limit
	}

	base := db.Preload("Category").Preload("Galeries").Where("price >= ?", query.PriceForm)

	if query.Name != "" {
		base.Where("name like ?", "%"+query.Name+"%")
	}

	if query.PriceTo != 0 {
		base.Where("price <= ?", query.PriceTo)

	}

	if query.Tags != "" {
		base.Where("tags like ?", "%"+query.Tags+"%")
	}

	if query.Category != 0 {
		base.Where("category_id = ?", query.Category)
	}

	if err := base.Find(&products).Count(&count).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	base.Offset((query.Page - 1) * limit).Limit(limit)

	if err := base.Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	totalPages := math.Ceil(float64(count) / float64(limit))

	response.Data = products
	response.CurrentPage = query.Page
	response.Limit = query.Limit
	response.TotalPage = totalPages
	response.TotalData = int(count)

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   response,
	})
}
