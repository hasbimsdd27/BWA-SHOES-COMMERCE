package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductCategories struct {
	ID        uint   `json:"id" gorm:"primary_key;autoIncrement"`
	Name      string `json:"name"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-"`
}
