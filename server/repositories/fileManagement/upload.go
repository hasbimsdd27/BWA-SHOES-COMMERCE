package filemanagementRepositories

import (
	"fmt"
	"server/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Upload(c *fiber.Ctx) error {
	file, err := c.FormFile("assets")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	uniqueId := uuid.New()

	filename := strings.Replace(uniqueId.String(), "-", "", -1)

	fileExt := strings.Split(file.Filename, ".")[1]

	fileName := fmt.Sprintf("%s.%s", filename, fileExt)

	if err := c.SaveFile(file, fmt.Sprintf("./assets/%s", fileName)); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	imageUrl := fmt.Sprintf("%s/assets/%s", utils.GetENV("SERVER_HOST"), fileName)

	data := map[string]interface{}{
		"image_name": fileName,
		"image_url":  imageUrl,
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   data,
	})
}
