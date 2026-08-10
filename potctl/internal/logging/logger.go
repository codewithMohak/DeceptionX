package logging

import (
	"os"

	"github.com/rs/zerolog"
)

var Log zerolog.Logger

func init() {
	Log = zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger()
}
