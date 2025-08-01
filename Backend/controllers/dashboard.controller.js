const Employee = require('../models/employee.model');
const Payroll = require('../models/payroll.model');

exports.getStats = async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'active' });

    const totalActive = employees.length;
    const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0);

    // Agrupa empleados por departamento
    const departmentCosts = {};
    employees.forEach(emp => {
      if (!departmentCosts[emp.department]) departmentCosts[emp.department] = 0;
      departmentCosts[emp.department] += emp.salary;
    });

    res.json({
      totalActive,
      totalSalaries,
      departmentCosts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPayrollTrends = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ period: 1 });

    const monthlyTrends = payrolls.map(p => ({
      name: p.period,
      value: p.totalGross 
    }));

    // Calcula costos por departamento (última nómina)
    let departmentCosts = [];
    if (payrolls.length > 0) {
      // Toma la nómina más reciente
      const latest = payrolls[payrolls.length - 1];
      const employeeCosts = {};

      latest.employees.forEach(e => {
        const dept = e.employee.department || 'Otro';
        if (!employeeCosts[dept]) employeeCosts[dept] = 0;
        employeeCosts[dept] += e.grossAmount;
      });

      departmentCosts = Object.entries(employeeCosts).map(([name, value]) => ({
        name,
        value
      }));
    }

    res.json({ monthlyTrends, departmentCosts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTurnover = async (req, res) => {
  try {
    // MOCK: valor fijo
    // const turnover = 8.5;

    // cálculo real:
    // Empleados dados de baja este año (status: 'inactive', updatedAt en este año)
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const inactiveThisYear = await Employee.countDocuments({
      status: 'inactive',
      updatedAt: { $gte: yearStart }
    });

    // Promedio de empleados (puedes tomar total activos + inactivos)/2
    const totalEmployees = await Employee.countDocuments();
    const avgEmployees = totalEmployees / 2 || 1;

    // Calcula rotación (%)
    const turnover = Math.round((inactiveThisYear / avgEmployees) * 1000) / 10; // ej: 8.5%

    res.json({ turnover });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
