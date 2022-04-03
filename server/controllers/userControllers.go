package controllers

import (
	userRepositories "server/repositories/user"

	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	return userRepositories.Register(c)
}
