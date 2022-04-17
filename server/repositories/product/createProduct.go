package productRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Payload struct {
	Name        string   `json:"name"`
	Price       float32  `json:"price"`
	Description string   `json:"description"`
	Tags        string   `json:"tags"`
	CategoryId  string   `json:"category_id"`
	Galeries    []string `json:"galeries"`
}

type ErrorMessage struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func CreateProduct(c *fiber.Ctx) error {
	payload := &Payload{}
	var category models.ProductCategories
	db := libs.DB
	var errors []ErrorMessage

	if err := c.BodyParser(payload); err != nil {
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

	if payload.Name == "" {

		newError := new(ErrorMessage)
		newError.Field = "name"
		newError.Message = "name can't be empty"
		errors = append(errors, *newError)
	}

	if payload.Price <= 0 {
		newError := new(ErrorMessage)
		newError.Field = "price"
		newError.Message = "price must be greater than 0"
		errors = append(errors, *newError)
	}

	if payload.CategoryId == "" {
		newError := new(ErrorMessage)
		newError.Field = "category_id"
		newError.Message = "invalid category_id"
		errors = append(errors, *newError)
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

	if len(errors) != 0 {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": errors,
		})
	}

	product := &models.Products{
		ID:          uuid.New(),
		Name:        payload.Name,
		Price:       payload.Price,
		Tags:        payload.Tags,
		Description: payload.Description,
		CategoryId:  payload.CategoryId,
	}

	if err := db.Create(&product).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if len(payload.Galeries) > 0 && product.ID != uuid.Nil {
		Galeries := []models.ProductGaleries{}

		for _, value := range payload.Galeries {
			Galeries = append(Galeries, models.ProductGaleries{
				ID:        uuid.New(),
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

	db.Preload("Category").Preload("Galeries").Where("id = ?", product.ID).First(&product)

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   product,
	})

}
