package repositories

import "github.com/gofiber/fiber/v2"

func HelloRepositories(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Hello World",
	})
}
