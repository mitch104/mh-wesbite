---
title: Docker Crash Course
path: /docker-crash-course
date: 2019-02-26
summary: This document provides an introduction and reference guide for developing with the containerisation tool Docker and is by no means exhaustive.
tags: ['Backend', 'Docker']
---

This document provides an introduction and reference guide for developing with the containerisation tool [Docker](https://www.docker.com/) and is by no means exhaustive. If you wish to further your knowledge on the capabilities of Docker please see the [Resources](#resources) section.

### Overview
Docker is a tool for running applications in an isolated environment, known as a [Docker container](https://www.docker.com/resources/what-container#/package_software), this gives many advantages such as reducing machine specific setup problems and being able to quickly spin up an application for development without going through the pain of following a (potentially outdated) README file.

Virtual machines can achieve environment isolation however Docker containers are much less computationally and memory intensive, allowing you to run multiple applications each in a sandboxed environment where the processes will not conflict with one and other ([comparison to virtual machines](https://stackoverflow.com/questions/16047306/how-is-docker-different-from-a-virtual-machine)).

Docker has become widely accepted among the development community since it's initial release in 2013, a 2018 [Datadog survey](https://www.datadoghq.com/docker-adoption/) reports that 25% of companies have adopted Docker in some form. Docker did not invent the concept of containers, it was originally built upon [Linux Container](https://en.wikipedia.org/wiki/LXC) technology, however it is the tooling for automating and customising the creation of containers and ability to share and re-use these blueprints that Docker has brought to the table ([comparision to LXC](https://docs.docker.com/engine/faq/#what-does-docker-technology-add-to-just-plain-lxc)).

### Community Edition Installation
 - [Ubuntu install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
 - [Mac install](https://docs.docker.com/docker-for-mac/install/)

### Docker Images
A Docker container is a running instance of a [Docker image](https://docs.docker.com/v17.09/engine/userguide/storagedriver/imagesandcontainers/) (an image is to a container as a `Class` is to an `Object` in terms of OOP), the image encompasses the state of the OS, software and application code.

[Docker Hub](https://hub.docker.com/) is a registry which allows anyone to share and download images for re-use, with over 2 million images available. The Docker team maintain a useful set of images in a [standard library](https://hub.docker.com/search/?q=&type=image&image_filter=official), for example [Redis](https://hub.docker.com/_/redis), [postgres](https://hub.docker.com/_/postgres), [python](https://hub.docker.com/_/python), [nginx](https://hub.docker.com/_/nginx) etc. Usefully you can inherit from one or more images then add customisation to curate an image for your use case, this can save a lot of time of as often someone else has uploaded a configuration which you can leverage. Some images even come with a helpful 'How to use this image' section e.g. see the [Python image](https://hub.docker.com/_/python/).

There are other available registries available such as the [GitLab Container Registry](https://about.gitlab.com/2016/05/23/gitlab-container-registry/) and [Google Cloud Registry](https://cloud.google.com/container-registry/).

The configuration file from which an image is built is known as a [Dockerfile](https://docs.docker.com/engine/reference/builder/). Each line in the file is an instruction which when executed adds a new layer to the image.

### Docker CLI
There is a [Docker Command Line Interface](https://docs.docker.com/engine/reference/commandline/cli/) for managing and interacting with Docker images and containers. To see all of the available commands run `docker --help` in a terminal. The following is a selection of commands that are regularly used in development with Docker:
 - ```bash
 docker build [OPTIONS] PATH | URL | -
 ```
The [build command](https://docs.docker.com/engine/reference/commandline/build/) executes the Dockerfile in order to build an image, if the `-f` option is omitted it will default to `Dockerfile` so ensure you are running this from the correct directory.
 - ```bash
 docker image ls [OPTIONS] [REPOSITORY[:TAG]]
 ```
 The [image ls command](https://docs.docker.com/engine/reference/commandline/image_ls/) lists the images that you have downloaded or created on your machine.
 - ```bash
 docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
 ```
 The [run command](https://docs.docker.com/engine/reference/commandline/run/) will run a given command in a new container. For example `docker run -it ubuntu bash` runs bash inside a container where `-i` means it is an interactive session, `-t` allocates a pseudo-TTY, `ubuntu` is the image name and `bash` is the command.
 - ```bash
 docker ps [OPTIONS]
 ```
 The [ps command](https://docs.docker.com/engine/reference/commandline/ps/) lists all of the running containers.
 - ```bash
 docker system prune [OPTIONS]
 ```
 The [system prune command](https://docs.docker.com/engine/reference/commandline/system_prune/) removes unused data, a common use case for this is to remove the data from a database.
 - ```bash
 docker exec -i -t CONTAINER /bin/bash
 ```
 This allows you to execute bash commands inside of a running docker container, where `CONTAINER` can be the ID or name of the container found using `docker ps`. This can be used to run sql queries against a database running inside a container for example.

### Docker Compose
For most of the projects a fully fledged system comprises of more than one component e.g. Django connecting to a postgres database, it is best practice to have each of these components running in separate containers. [Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. See [here](https://docs.docker.com/compose/install/) for the installation guide.

`docker-compose.yml` is the configuration file for defining services that make up your application so they can be run together in an isolated environment, full reference for usage can be found [here](https://docs.docker.com/compose/compose-file/).

Docker Compose also has it's own [CLI](https://docs.docker.com/compose/reference/overview/) for building images and running multiple containers. Here are a couple of commonly used in development:
 - ```bash
 docker-compose build [options] [--build-arg key=val...] [SERVICE...]
 ```
 The [build command](https://docs.docker.com/compose/reference/build/) builds the images required for all services defined in `docker-compose.yml`.  
 - ```bash
 docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]
 ```
 The [up command](https://docs.docker.com/compose/reference/up/) starts the running of containers.
 - ```bash
 docker-compose run --service-ports SERVICE
 ```
 Using the `--service-ports` flag means that you are able to use [ipdb](https://github.com/gotcha/ipdb) or other debug tools whilst running docker.

### Docker Network
Containers run within a [Docker Network](https://docs.docker.com/network/), this can be configured to provide complete isolation, which enable building web applications that work together securely. For containers to communicate, e.g. Django communicating with a postgres instance, ports need to be exposed within the Docker network using an [EXPOSE](https://docs.docker.com/compose/compose-file/#expose) instruction in the Dockerfile or an [expose](https://docs.docker.com/compose/compose-file/#expose) declaration in the `docker-compose.yml` file. However there might be cases where you want to access the network externally, such as calling a public API or viewing a served webpage. Ports of the network can be published to the host network either with `-p` flag on the [docker run command](https://docs.docker.com/engine/reference/commandline/run/) or the [ports](https://docs.docker.com/compose/compose-file/#ports) declaration in a `docker-compose.yml` file.

One common 'gotcha' is that in order to serve a Django application you must use `0.0.0.0` as the ip e.g. `python manage.py runserver 0.0.0.0:8000`, in this case you would want to make port `8000` public in order to access the site via a web browser.

### Docker Volumes
When developing with Docker it is likely that you want to make changes to the application code that is running inside docker, [volumes](https://docs.docker.com/storage/volumes/) allow changes to code to be reflected inside of a container by giving the container access to part of the local file system. A volume can be defined using the [VOLUME](https://docs.docker.com/engine/reference/builder/#volume) instruction in a Dockerfile, `-v` flag for the `docker run` command or the [volumes](https://docs.docker.com/compose/compose-file/#volumes) declaration in a `docker-compose.yml`.

### Docker for Frontend
You can also use Docker for frontend development, you can build tools such as [Gulp](https://github.com/gulpjs/gulp) in a container in order to build the relative frontend files and subsequently pick up code changes during frontend development. Since the lifetime of a Docker container is the lifetime of the main process, the container will continue to run for as long as the Gulp process executes.

### Docker GUIs
If you prefer using a GUI to visualise and interact with running Docker containers, here are some options:

 - [Kitematic](https://kitematic.com/) (The default GUI created by the Docker company)
 - [Portainer](https://www.portainer.io/)
 - [DockStation](https://dockstation.io/)
 - [MicroBadger](https://microbadger.com/)

It is important not be become over-reliant on a GUI as control via a CLI is sometimes the only option.

### Docker in Production
When it comes to deploying a system of multiple Docker containers to production, it can quickly escalte in complexity, this requires thinking about how to reliably restart, upgrade, scale and monitor containers. There are tools to help solve these problems such as [Kubernetes](https://kubernetes.io/), [Docker Swarm](https://docs.docker.com/engine/swarm/) and [Nomad](https://www.nomadproject.io/) but each come with a the cost of time investment in learning.

### Resources
 - [Docker documentation](https://docs.docker.com/)
 - [Docker Compose documentation](https://docs.docker.com/compose/)
 - ['Docker for beginners' tutorial](https://docker-curriculum.com/)
 - ['Getting started with Docker' tutorial](https://serversforhackers.com/c/getting-started-with-docker)
 - ['Learn Docker in 12 Minutes' video](https://www.youtube.com/watch?v=YFl2mCHdv24)
 - ['Docker Compose in 12 minutes' video](https://www.youtube.com/watch?v=Qw9zlE3t8Ko)
 - [An awesome list of Docker resources](https://github.com/veggiemonk/awesome-docker)
 - [The Docker Book](https://www.amazon.com/gp/product/B00LRROTI4/)
 - [Using Docker (O'Reilly)](https://www.amazon.com/Using-Docker-Developing-Deploying-Containers/dp/1491915765/)
 - [Docker Cookbook (O'Reilly)](https://www.amazon.com/Docker-Cookbook-Solutions-Distributed-Applications/dp/149191971X/)
