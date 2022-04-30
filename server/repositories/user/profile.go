package userRepositories

import (
	"server/libs"
	"server/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type PayloadProfile struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	Phone           string `json:"phone"`
	Fullname        string `json:"fullname"`
	AddressID       int    `json:"address_id"`
	AddressType     string `json:"address_type"`
	CompleteAddress string `json:"complete_address"`
}

type ResponseData struct {
	UserData    models.Users       `json:"user_data"`
	UserAddress models.UserAddress `json:"user_address"`
}

func UserProfile(c *fiber.Ctx) error {
	var userData models.Users
	var userAddress models.UserAddress
	var payload PayloadProfile
	var err error
	var response ResponseData

	db := libs.DB

	if err := c.BodyParser(&payload); err != nil {
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

	if err = db.Where("id = ?", c.Locals("user_id")).First(&userData).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(404).JSON(fiber.Map{
				"status":  "error",
				"message": "user not exist",
			})
		} else {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}

	if err = db.Where("user_id = ?", c.Locals("user_id")).First(&userAddress).Error; err != nil {
		if err.Error() != "record not found" {
			return c.Status(500).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}

	if payload.Email != "" && payload.Email != userData.Email {
		var userWithEmail models.Users

		if err = db.Where("email = ?", payload.Email).First(&userWithEmail).Error; err != nil {
			if err.Error() != "record not found" {
				return c.Status(500).JSON(fiber.Map{
					"status":  "error",
					"message": err.Error(),
				})
			}
		}

		if userWithEmail.ID != uuid.Nil {
			return c.Status(409).JSON(fiber.Map{
				"status":  "error",
				"message": "email already exist",
			})
		} else {
			userData.Email = payload.Email
		}
	}

	if payload.Phone != "" && payload.Phone != userData.Phone {
		var userWithPhone models.Users

		if err = db.Where("phone = ?", payload.Phone).First(&userWithPhone).Error; err != nil {
			if err.Error() != "record not found" {
				return c.Status(500).JSON(fiber.Map{
					"status":  "error",
					"message": err.Error(),
				})
			}
		}

		if userWithPhone.ID != uuid.Nil {
			return c.Status(409).JSON(fiber.Map{
				"status":  "error",
				"message": "phone number already exist",
			})
		} else {
			userData.Phone = payload.Phone
		}
	}

	if payload.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"status": "error",
				"data":   err.Error(),
			})
		}
		userData.Password = string(hashedPassword)
	}

	if payload.Fullname != "" {
		userData.Name = payload.Fullname
	}

	if payload.AddressID != 0 && payload.AddressID != userAddress.AddressID {
		userAddress.AddressID = payload.AddressID
	}

	if payload.AddressType != "" && payload.AddressType != userAddress.AddressType {
		userAddress.AddressType = payload.AddressType
	}

	if payload.CompleteAddress != "" {
		userAddress.CompleteAddress = payload.CompleteAddress
	}

	db.Save(&userData)

	if userAddress.ID != uuid.Nil {
		db.Save(&userAddress)
	} else {
		userAddress.ID = uuid.New()
		userAddress.UserID = userData.ID
		db.Save(&userAddress)
	}

	response.UserData = userData
	response.UserAddress = userAddress

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   response,
	})
}
