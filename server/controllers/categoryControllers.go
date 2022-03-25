package controllers

import (
	"server/repositories"

	"github.com/gofiber/fiber/v2"
)

func CreateCategory(c *fiber.Ctx) error {
	return repositories.CreateCategory(c)
}
