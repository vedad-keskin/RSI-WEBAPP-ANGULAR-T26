using Market.Application.Modules.Sales.Uplate.Commands.Create;
using Market.Application.Modules.Sales.Uplate.Queries.List;
namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UplateController(ISender sender) : ControllerBase
{


    [HttpPost]
    // Fallback policy already requires authenticated user
    public async Task<ActionResult<int>> Create(CreateUplataCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return StatusCode(StatusCodes.Status201Created , new {id});
    }




    [HttpGet]
    public async Task<PageResult<ListUplateQueryDto>> List([FromQuery] ListUplateQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

}
