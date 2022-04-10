package userRepositories

import (
	"server/libs"
	"server/models"
	"server/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type RegisterPayload struct {
	Fullname string `json:"fullname"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

type ErrorMessage struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type Claims struct {
	Id int `json:"id"`
	jwt.StandardClaims
}

type ResponseRegister struct {
	AccessToken string `json:"access_token"`
	Role        string `json:"role"`
	Fullname    string `json:"fullname"`
}

func Register(c *fiber.Ctx) error {
	var payload RegisterPayload
	var errorMessage []ErrorMessage
	var UserData models.Users

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

	if err := db.Where("email = ?", payload.Email).First(&UserData).Error; err != nil {
		if err.Error() != "record not found" {
			return c.Status(500).JSON(fiber.Map{
				"status": "error",
				"data":   err.Error(),
			})
		}
	}

	if UserData.ID != 0 {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "email",
			Message: "email already taken",
		})
	}

	if err := db.Where("username = ?", payload.Username).First(&UserData).Error; err != nil {
		if err.Error() != "record not found" {
			return c.Status(500).JSON(fiber.Map{
				"status": "error",
				"data":   err.Error(),
			})
		}
	}

	if UserData.ID != 0 {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "username",
			Message: "username already taken",
		})
	}

	if payload.Password == "" {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "password",
			Message: "password can't be empty",
		})
	}

	if payload.Email == "" {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "email",
			Message: "email can't be empty",
		})
	}

	if payload.Username == "" {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "username",
			Message: "username can't be empty",
		})
	}

	if len(errorMessage) > 0 {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"data":   errorMessage,
		})
	}

	UserData.Email = payload.Email
	UserData.Username = payload.Username
	UserData.Password = payload.Password
	UserData.Phone = payload.Phone

	if payload.Role == "ADMIN" {
		UserData.Role = "ADMIN"
	} else {
		UserData.Role = "USER"
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"data":   err.Error(),
		})
	}

	UserData.Password = string(hashedPassword)

	if err := db.Create(&UserData).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"data":   err.Error(),
		})
	}

	claims := &Claims{
		Id: int(UserData.ID),
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
			Role:        string(UserData.Role),
			Fullname:    UserData.Name,
		},
	})
}
