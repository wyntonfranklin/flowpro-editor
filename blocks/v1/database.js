module.exports = [
    {
        type: "action",
        title: 'MySQL Query',
        category: "database",
        description : 'Run a MySQL Query',
        icon : 'ic_leaf.png',
        action: 'action_run_mysql_query',
        properties: [
            {
                type : "text",
                label : "Connection String",
                value : ""
            },
            {
                type : "longtext",
                label : "Sql Query",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'MySQL Query with Params',
        category: "database",
        description : 'Run a MySQL Query with Params',
        icon : 'ic_leaf.png',
        action: 'action_escaped_query',
        properties: [
            {
                type : "text",
                label : "Connection String",
                value : ""
            },
            {
                type : "longtext",
                label : "Sql Query",
                value : ""
            },
            {
                type : "text",
                label : "Parameters",
                value : ""
            },
        ]
    },
    {
        type: "action",
        title: 'SQL Server Query',
        category: "database",
        description : 'MSSQL Query using connection string',
        icon : 'ic_leaf.png',
        action: 'action_tsql_query',
        properties: [
            {
                type : "text",
                label : "Database Conn String",
                value : ""
            },
            {
                type : "longtext",
                label : "Sql Query",
                value : ""
            },
        ]
    },
    /*
    {
        type: "action",
        title: 'SQL Server Query 2',
        category: "database",
        description : 'MSSQL Query using object parameters',
        icon : 'ic_leaf.png',
        action: 'action_tsql_object_query',
        properties: [
            {
                type : "text",
                label : "Database Conn String",
                value : ""
            },
            {
                type : "longtext",
                label : "Sql Query",
                value : ""
            },
        ]
    },*/
    {
        type: "action",
        title: 'SQLITE Query',
        category: "database",
        description : 'Run a SQLITE QUERY',
        icon : 'ic_leaf.png',
        action: 'action_sqlite_query',
        properties: [
            {
                type : "text",
                label : "Database Path",
                value : ""
            },
            {
                type : "longtext",
                label : "Sql Query",
                value : ""
            },
        ]
    },
]