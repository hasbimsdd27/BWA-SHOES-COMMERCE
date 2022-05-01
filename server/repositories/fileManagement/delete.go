package filemanagementRepositories

import (
	"errors"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func Delete(c *fiber.Ctx) error {
	imageName := c.Params("imageName")

	if _, err := os.Stat(fmt.Sprintf("./assets/%s", imageName)); err == nil {
		if errDel := os.Remove(fmt.Sprintf("./assets/%s", imageName)); errDel != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": errDel.Error()})
		}

		return c.Status(204).JSON(fiber.Map{
			"status": "success",
		})
	} else if errors.Is(err, os.ErrNotExist) {
		// return c.Status(404).JSON(fiber.Map{
		// 	"status":  "error",
		// 	"message": "file not found",
		// })
		return c.Status(204).JSON(fiber.Map{
			"status": "success",
		})
	} else {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

}
