package webhookRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func Webhook(c *fiber.Ctx) error {
	var bodyPayload map[string]interface{}
	var transactionData models.Transactions
	var err error

	db := libs.DB

	if err := c.BodyParser(&bodyPayload); err != nil {
		if err.Error() == "Unprocessable Entity" {
			return c.Status(400).JSON(fiber.Map{
				"status":  "error",
				"message": "please submit a valid payload",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if err = db.Where("id = ?", bodyPayload["order_id"].(string)).First(&transactionData).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(404).JSON(fiber.Map{
				"status":  "error",
				"message": "data not exist",
			})
		} else {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}

	if bodyPayload["transaction_status"].(string) == "capture" {
		if bodyPayload["fraud_status"].(string) == "challange" {
			transactionData.Status = "CHALLANGE"
		} else if bodyPayload["fraud_status"].(string) == "accept" {
			transactionData.Status = "SUCCESS"
		}
	} else if bodyPayload["transaction_status"].(string) == "settlement" {
		transactionData.Status = "SUCCESS"
	} else if bodyPayload["transaction_status"].(string) == "cancel" ||
		bodyPayload["transaction_status"].(string) == "deny" ||
		bodyPayload["transaction_status"].(string) == "expire" {
		transactionData.Status = "FAILURE"
	} else if bodyPayload["transaction_status"].(string) == "pending" {
		transactionData.Status = "PENDING"
	}

	db.Save(&transactionData)

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "webhook received",
	})
}
