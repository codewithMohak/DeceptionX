package logging

import (
	"os"

	"github.com/rs/zerolog"
)

func Init() {
	Log = zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger()
}
