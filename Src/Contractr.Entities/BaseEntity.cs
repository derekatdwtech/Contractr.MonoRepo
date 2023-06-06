namespace Contractr.Entities
{
    public abstract class BaseEntity
    {
        public string id { get; set; } = Nanoid.Nanoid.Generate(size: 16, alphabet: Contractr.Entities.NanoidConstants.NANOID_CHARS);

    }
}