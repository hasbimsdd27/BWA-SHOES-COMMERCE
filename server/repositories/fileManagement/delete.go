package filemanagementRepositories

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func Delete(c *fiber.Ctx) error {
	imageName := c.Params("imageName")

	if err := os.Remove(fmt.Sprintf("./assets/%s", imageName)); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	return c.Status(204).JSON(fiber.Map{
		"status": "success",
	})

}
