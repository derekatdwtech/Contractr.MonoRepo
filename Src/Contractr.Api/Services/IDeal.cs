using System.Collections.Generic;
using Contractr.Entities;

namespace Contractr.Api.Services {
    public interface IDeal {

        List<Deal> GetDealsForOrganization(string organization);
        Deal AddDeal(Deal Deal);

        Deal GetDealById(string id);

        
    }
}