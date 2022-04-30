package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserAddress struct {
	ID              uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	UserID          uuid.UUID `gorm:"type:VARCHAR(255)" json:"user_id"`
	AddressID       int       `json:"address_id"`
	AddressType     string    `json:"address_type"`
	CompleteAddress string    `gorm:"type:TEXT" json:"complete_address"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       gorm.DeletedAt
}
