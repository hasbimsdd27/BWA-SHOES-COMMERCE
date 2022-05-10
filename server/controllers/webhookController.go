package controllers

import (
	webhookRepositories "server/repositories/webhook"

	"github.com/gofiber/fiber/v2"
)

func WebhookController(c *fiber.Ctx) error {
	return webhookRepositories.Webhook(c)
}
