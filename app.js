const { prompt } = require('inquirer')
const mysql = require('mysql2')
const db = mysql.createConnection('mysql://root:rootroot@localhost/employee_db')
const cTable = require('console.table')

const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'userChoice',
      message: 'What would you like to do?',
      choices: ['Add employee', 'Add role', 'Add department', 'View employees', 'View roles', 'View departments', 'Update employee roles', 'Finish']
    }])
    .then(answer => {
      switch (answer.userChoice) {
        case 'Add employee':
          addEmployee()
          break

        case 'Add role':
          addRole()
          break

        case 'Add department':
          addDepartment()
          break

        case 'View employees':
          viewEmployees()
          break

        case 'View roles':
          viewRoles()
          break

        case 'View departments':
          viewDepartments()
          break

        case 'Update employee roles':
          updateEmployeeRole()
          break

        case 'Finish':
          viewEmployeesFinish()
          break

      }
    })
    .catch(err => {
      console.log(err)
    })
}

const addEmployee = () => {
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) { console.log(err) }
    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))
    db.query('SELECT * FROM employee', (err, employees) => {

      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

      employees.unshift({ name: 'None', value: null })
      prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the employee first name?'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is their last name?'
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose a role for the employee:',
          choices: roles
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Choose a manager for the employee:',
          choices: employees
        }
      ])
        .then(employee => {
          console.log(employee)
          db.query('INSERT INTO employee SET ?', employee, (err) => {
            console.log(err)
            console.log('Employee Created!')
            mainMenu()
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}

const addRole = () => {
  db.query("SELECT * FROM department", (err, departments) => {
    if (err) { console.log(err) }
    departments = departments.map(department => ({
      name: department.name,
      value: department.id
    }))
    prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the role name?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary?'
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'What is the department?',
        choices: departments
      },
    ])
      .then(role => {
        console.log(role)
        db.query('INSERT INTO role SET ?', role, (err) => {
          if (err) { console.log(err) }
          console.log('role created')
          mainMenu()
        })
      })
      .catch(err => { console.log(err) })
  })
}

const addDepartment = () => {
  prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the department name?'
    }
  ])
    .then(department => {
      db.query('INSERT INTO department SET ?', department, (err) => {
        if (err) { console.log(err) }
        console.log('Department Added!')
        mainMenu()
      })
    })
    .catch(err => { console.log(err) })
}

const viewEmployees = () => {
  db.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        LEFT JOIN employee manager
        ON manager.id = employee.manager_id
    `, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    mainMenu()
  })
}


const viewRoles = () => {
  db.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id
`, (err, roles) => {
    if (err) { console.log(err) }
    console.table(roles)
    mainMenu()
  })
}


const viewDepartments = () => {
  db.query(`
        SELECT * FROM department
    `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })
}

const updateEmployeeRole = () => {
  db.query('SELECT * FROM employee', (err, employees) => {
    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))
    db.query('SELECT * FROM role', (err, roles) => {
      roles = roles.map(role => ({
        name: role.title,
        value: role.id
      }))
      prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Choose an employee to update',
          choices: employees
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose the employee new role',
          choices: roles
        },
      ])
        .then(employee => {
          console.log(employee.role_id)
          db.query('UPDATE employee SET role_id = ? WHERE employee.id = ?', [employee.role_id, employee.employee_id], (err) => {
            if (err) { console.log(err) }
            console.log('employee updated')
            mainMenu()
          })
        })
        .catch(err => { console.log(err) })
    })
  })
}

const viewEmployeesFinish = () => {
  db.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        LEFT JOIN employee manager
        ON manager.id = employee.manager_id
    `, (err, employees) => {
    if (err) { console.log(err) }
    console.log('Here is the completed list of employees!')
    console.table(employees)
    console.log('Thank you!')
  })
}

mainMenu()


