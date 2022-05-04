package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Users struct {
	ID          uuid.UUID   `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	Username    string      `json:"username"`
	Name        string      `json:"name"`
	Password    string      `json:"-"`
	Role        string      `json:"role"`
	Phone       string      `json:"phone"`
	Email       string      `json:"email"`
	UserAddress UserAddress `gorm:"foreignKey:UserID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `json:"-"`
}
