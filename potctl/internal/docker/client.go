package docker

import (
	"context"
	"time"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

type Wrapper struct {
	cli *client.Client
}

func New() (*Wrapper, error) {
	cli, err := client.New(
		client.FromEnv,
		client.WithAPIVersionNegotiation(),
	)
	if err != nil {
		return nil, err
	}
	return &Wrapper{cli: cli}, nil
}

func (w *Wrapper) StartContainer(ctx context.Context, name string) error {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	_, err := w.cli.ContainerStart(
		ctx,
		name,
		client.ContainerStartOptions{},
	)
	return err
}

func (w *Wrapper) StopContainer(ctx context.Context, name string) error {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	timeout := 10

	_, err := w.cli.ContainerStop(
		ctx,
		name,
		client.ContainerStopOptions{
			Timeout: &timeout,
		},
	)
	return err
}

func (w *Wrapper) ListContainers(
	ctx context.Context,
) ([]container.Summary, error) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	result, err := w.cli.ContainerList(
		ctx,
		client.ContainerListOptions{
			All: true,
		},
	)
	if err != nil {
		return nil, err
	}
	return result.Items, nil
}

func main() {

}
