package controllers

import (
	categoryRepositories "server/repositories/category"

	"github.com/gofiber/fiber/v2"
)

func CreateCategory(c *fiber.Ctx) error {
	return categoryRepositories.CreateCategory(c)
}
