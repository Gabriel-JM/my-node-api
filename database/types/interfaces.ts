export interface QueryObject {
    values?: string
    where?: [string, (string | number | boolean)]
    join?: Join
    orderBy?: string
}

export interface Join {
    table: string
    on: [string, string]
    join?: Join
}

export interface ValuesInsert {
    values: (string | number | boolean)[] | object
}
