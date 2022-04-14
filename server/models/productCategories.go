package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductCategories struct {
	ID        uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-"`
}
