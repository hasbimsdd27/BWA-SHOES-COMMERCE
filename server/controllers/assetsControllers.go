package controllers

import (
	filemanagementRepositories "server/repositories/fileManagement"

	"github.com/gofiber/fiber/v2"
)

func UploadAssets(c *fiber.Ctx) error {
	return filemanagementRepositories.Upload(c)
}

func DeleteAssets(c *fiber.Ctx) error {
	return filemanagementRepositories.Delete(c)
}
