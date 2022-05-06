package cartRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type payloadAddToCart struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

func AddToCart(c *fiber.Ctx) error {
	var payload payloadAddToCart
	var err error
	var cartData models.UserCart

	db := libs.DB

	if err = c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "check your input data",
		})
	}

	if err = db.Where("product_id = ? AND user_id = ?", payload.ProductID, c.Locals("user_id")).First(&cartData).Error; err != nil {

		if err.Error() != "record not found" {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}

	}

	if payload.ProductID == "" || payload.Quantity <= 0 {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "please fill required field",
		})
	}

	userID := c.Locals("user_id").(string)

	cartData.UserID = uuid.Must(uuid.Parse(userID))
	cartData.ProductID = uuid.Must(uuid.Parse(payload.ProductID))
	cartData.Quantity = payload.Quantity

	if cartData.ID == uuid.Nil {
		cartData.ID = uuid.New()
		if err = db.Create(&cartData).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	} else {
		db.Save(&cartData)
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   cartData,
	})
}
