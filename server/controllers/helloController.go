package controllers

import (
	"server/repositories"

	"github.com/gofiber/fiber/v2"
)

func HelloWorldController(c *fiber.Ctx) error {
	return repositories.HelloRepositories(c)
}
