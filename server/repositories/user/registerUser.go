package userRepositories

import (
	"server/libs"
	"server/models"
	"server/utils"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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
	Id   uuid.UUID `json:"id"`
	Role string    `json:"role"`
	jwt.StandardClaims
}

type ResponseRegister struct {
	AccessToken string `json:"access_token"`
	Role        string `json:"role"`
	Fullname    string `json:"fullname"`
	Phone       string `json:"phone"`
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

	if UserData.ID != uuid.Nil {
		errorMessage = append(errorMessage, ErrorMessage{
			Field:   "email",
			Message: "email already taken",
		})
	}

	if UserData.ID != uuid.Nil {
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

	if len(errorMessage) > 0 {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"data":   errorMessage,
		})
	}
	UserData.ID = uuid.New()
	UserData.Email = payload.Email
	UserData.Password = payload.Password
	UserData.Phone = payload.Phone
	UserData.Name = payload.Fullname
	UserData.Username = strings.ToLower(strings.Split(payload.Fullname, " ")[0] + utils.GenerateRandomString(6))

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
		Id:   UserData.ID,
		Role: string(UserData.Role),
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
