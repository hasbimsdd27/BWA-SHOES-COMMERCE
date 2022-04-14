package categoryRepositories

import (
	"math"
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

type QueryData struct {
	Limit int    `query:"limit"`
	Name  string `query:"name"`
	Page  int    `query:"page"`
}

type ResponseData struct {
	Data        []models.ProductCategories `json:"data"`
	TotalPage   float64                    `json:"total_pages"`
	CurrentPage int                        `json:"current_page"`
	Limit       int                        `json:"limit"`
	TotalData   int                        `json:"total_data"`
}

func GetAllCategory(c *fiber.Ctx) error {
	var categories []models.ProductCategories
	var limit int
	var count int64
	var response ResponseData

	var query QueryData
	db := libs.DB

	if err := c.QueryParser(&query); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if query.Limit < 5 {
		limit = 5
	} else {
		limit = query.Limit
	}

	dbData := db.Where("name like ?", "%"+query.Name+"%")

	if err := dbData.Model(&models.ProductCategories{}).Count(&count).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if err := dbData.Offset((query.Page - 1) * limit).Limit(limit).Order("created_at desc").Find(&categories).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	totalPages := math.Ceil(float64(count) / float64(limit))

	response.Data = categories
	response.CurrentPage = query.Page
	response.Limit = limit
	response.TotalPage = totalPages
	response.TotalData = int(count)

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   response,
	})
}
