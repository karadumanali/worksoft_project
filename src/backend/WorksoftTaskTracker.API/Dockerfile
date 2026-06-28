FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln .
COPY WorksoftTaskTracker.Domain/*.csproj WorksoftTaskTracker.Domain/
COPY WorksoftTaskTracker.Application/*.csproj WorksoftTaskTracker.Application/
COPY WorksoftTaskTracker.Infrastructure/*.csproj WorksoftTaskTracker.Infrastructure/
COPY WorksoftTaskTracker.API/*.csproj WorksoftTaskTracker.API/

RUN dotnet restore

COPY . .
RUN dotnet publish WorksoftTaskTracker.API -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "WorksoftTaskTracker.API.dll"]