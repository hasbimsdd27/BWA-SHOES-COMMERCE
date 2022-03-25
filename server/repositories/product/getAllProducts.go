package productRepositories

import (
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
	PriceTo     int    `query:"preice_to"`
	Tags        string `query:"tags"`
	Category    int    `query:"category"`
	Page        int    `query:"page"`
}

type ResponseData struct {
	Data        []models.Products `json:"data"`
	TotalPage   int               `json:"total_pages"`
	CurrentPage int               `json:"current_page"`
	Limit       int               `json:"limit"`
}

func AllProducts(c *fiber.Ctx) error {
	var products []models.Products
	var count int64
	var limit int
	var response ResponseData

	query := new(QueryData)

	if err := c.QueryParser(query); err != nil {
		return c.Status(400).JSON(fiber.Map{
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

	base := db.Model(&models.Products{}).Where("price >= ?", query.PriceForm).Offset(query.Page * limit).Limit(limit)

	if query.Id != 0 {
		base.Where("id = ?", query.Id)
	}

	if query.Description != "" {
		base.Where("description = ?", query.Description)
	}

	if query.Name != "" {
		base.Where("name = ?", query.Name)
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

	totalPages := int(count) / limit

	response.Data = products
	response.CurrentPage = query.Page
	response.Limit = query.Limit
	response.TotalPage = totalPages

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   response,
	})
}
