package userRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func GetUserProfile(c *fiber.Ctx) error {
	var userData models.Users

	userId := c.Locals("user_id")
	db := libs.DB

	if err := db.Preload("UserAddress").Where("id = ?", userId).First(&userData).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"data":   err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   userData,
	})

}
