data "external_schema" "sequelize" {
    program = [
        "npx",
        "@ariga/ts-atlas-provider-sequelize",
        "load",
        "--path", "./models",
        "--dialect", "mysql",
    ]
}

env "sequelize" {
    src = data.external_schema.sequelize.url
    dev = "mysql://root@localhost:3306/5esgi-next"

    migration {
        dir = "file://migrations"
    }

    format {
        migrate {
            diff = "{{ sql . \"  \" }}"
        }
    }
}