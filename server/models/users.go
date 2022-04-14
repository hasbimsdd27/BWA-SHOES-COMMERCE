package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserType string

type Users struct {
	ID        uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	Password  string
	Role      UserType `json:"role"`
	Phone     string   `json:"phone"`
	Email     string   `json:"email"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}
