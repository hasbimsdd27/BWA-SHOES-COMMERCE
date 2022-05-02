package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserCart struct {
	ID            uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	UserID        uuid.UUID `gorm:"type:VARCHAR(255)" json:"user_id"`
	ProductID     uuid.UUID `gorm:"type:VARCHAR(255)" json:"product_id"`
	ProductDetail Products  `gorm:"foreignKey:ProductID"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt
}
