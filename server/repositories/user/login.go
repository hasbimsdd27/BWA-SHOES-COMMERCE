package userRepositories

import (
	"server/libs"
	"server/models"
	"server/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type PayloadLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var payloadLogin PayloadLogin
	var errorMessage []ErrorMessage
	var user models.Users

	if err := c.BodyParser(&payloadLogin); err != nil {
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

	if payloadLogin.Email == "" {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "email",
			Message: "email can't be empty",
		})
	}

	if payloadLogin.Password == "" {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "password",
			Message: "password can't be empty",
		})
	}

	if len(errorMessage) > 0 {
		c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": errorMessage,
		})
	}

	db := libs.DB

	if err := db.Where("email = ?", payloadLogin.Email).First(&user).Error; err != nil {
		if err.Error() == "record not found" {
			return c.Status(400).JSON(fiber.Map{
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

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payloadLogin.Password)); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "user not exist",
		})
	}

	claims := &Claims{
		Id: int(user.ID),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	AccessKey := utils.GetENV("ACCESS_KEY_SECRET")

	tokenString, err := token.SignedString([]byte(AccessKey))

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"data":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data": &ResponseRegister{
			AccessToken: tokenString,
		},
	})
}
