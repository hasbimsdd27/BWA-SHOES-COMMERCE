package middlewares

import "github.com/gofiber/fiber/v2"

func IsAdmin(c *fiber.Ctx) error {
	if c.Locals("user_role") != "ADMIN" {
		return c.Status(403).JSON(fiber.Map{
			"status":  "error",
			"message": "not allowed",
		})
	} else {
		return c.Next()
	}
}
