namespace rutinadeldiaservidor.Services
{
    public interface IRecordatorioService
    {
        Task EnviarRecordatorioAsync(int recordatorioId);
        Task ProgramarRecordatorioAsync(int recordatorioId);
        Task ActualizarProgramacionAsync(int recordatorioId);
        Task CancelarProgramacionAsync(int recordatorioId);
    }
}
